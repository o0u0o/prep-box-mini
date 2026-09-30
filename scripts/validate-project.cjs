'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_EXTENSIONS = new Set([
  '.cjs',
  '.js',
  '.json',
  '.md',
  '.wxml',
  '.wxss',
  '.yaml',
  '.yml'
]);
const IGNORED_DIRECTORIES = new Set([
  '.git',
  '.idea',
  'imgs',
  'miniprogram_npm',
  'node_modules'
]);
const ROOT_TEXT_FILES = ['.editorconfig', 'LICENSE'];
const failures = [];
let checkCount = 0;

function check(condition, message) {
  checkCount += 1;
  if (!condition) {
    failures.push(message);
  }
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readJson(relativePath) {
  const filePath = path.join(ROOT, relativePath);
  try {
    return JSON.parse(readText(filePath));
  } catch (error) {
    failures.push(`${relativePath}: JSON 解析失败（${error.message}）`);
    return null;
  }
}

function collectSourceFiles(directory, result = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(filePath, result);
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      result.push(filePath);
    }
  }
  return result;
}

function relative(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function validateFormatting(files) {
  for (const filePath of files) {
    const content = readText(filePath);
    check(!content.includes('\t'), `${relative(filePath)}: 请使用两个空格缩进，不能使用 Tab`);
    check(!/[ \t]+$/m.test(content), `${relative(filePath)}: 存在行尾空白`);
    check(content.endsWith('\n'), `${relative(filePath)}: 文件末尾缺少换行`);
    check(!content.endsWith('\n\n'), `${relative(filePath)}: 文件末尾存在多余空行`);
  }
}

function validatePages(appConfig) {
  if (!appConfig || !Array.isArray(appConfig.pages)) {
    return;
  }

  const registeredPages = new Set(appConfig.pages);
  const pageDirectories = fs.readdirSync(path.join(ROOT, 'pages'), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  for (const directory of pageDirectories) {
    const pagePath = `pages/${directory}/${directory}`;
    check(registeredPages.has(pagePath), `${pagePath}: 页面目录未在 app.json 中注册`);
  }

  for (const pagePath of registeredPages) {
    for (const extension of ['js', 'json', 'wxml', 'wxss']) {
      check(
        fs.existsSync(path.join(ROOT, `${pagePath}.${extension}`)),
        `${pagePath}.${extension}: 已注册页面缺少配套文件`
      );
    }

    const pageConfig = readJson(`${pagePath}.json`);
    if (!pageConfig) {
      continue;
    }

    check(pageConfig.component !== true, `${pagePath}.json: app.json 注册的是页面，不能声明 component: true`);

    const wxmlPath = path.join(ROOT, `${pagePath}.wxml`);
    if (!fs.existsSync(wxmlPath)) {
      continue;
    }

    const wxml = readText(wxmlPath);
    const usedComponents = new Set(
      Array.from(wxml.matchAll(/<\s*(l-[a-z0-9-]+)\b/g), match => match[1])
    );
    const registeredComponents = new Set(Object.keys(pageConfig.usingComponents || {}));

    for (const component of usedComponents) {
      check(
        registeredComponents.has(component),
        `${pagePath}.json: WXML 使用了 ${component}，但 usingComponents 未注册`
      );
    }
    for (const component of registeredComponents) {
      check(
        usedComponents.has(component),
        `${pagePath}.json: usingComponents 注册了未使用的 ${component}`
      );
    }
  }
}

function validateCss(files) {
  const styleFiles = files.filter(filePath => path.extname(filePath) === '.wxss');
  const allStyles = styleFiles.map(readText).join('\n');
  const definedVariables = new Set(
    Array.from(allStyles.matchAll(/--([a-zA-Z0-9_-]+)\s*:/g), match => match[1])
  );

  for (const match of allStyles.matchAll(/var\(--([a-zA-Z0-9_-]+)/g)) {
    check(definedVariables.has(match[1]), `WXSS 使用了未定义的变量 --${match[1]}`);
  }

  for (const wxmlPath of files.filter(filePath => path.extname(filePath) === '.wxml')) {
    const wxssPath = wxmlPath.replace(/\.wxml$/, '.wxss');
    if (!fs.existsSync(wxssPath)) {
      continue;
    }

    const wxml = readText(wxmlPath);
    const wxss = readText(wxssPath);
    const classNames = Array.from(wxml.matchAll(/class\s*=\s*"([^"]+)"/g))
      .flatMap(match => match[1].split(/\s+/))
      .map(className => className.replace(/\{\{.*?\}\}/g, '').trim())
      .filter(className => className && !/[{}?:'"()!]/.test(className));
    const definedClasses = new Set(
      Array.from(wxss.matchAll(/\.([a-zA-Z_][\w-]*)/g), match => match[1])
    );

    for (const className of new Set(classNames)) {
      check(
        definedClasses.has(className),
        `${relative(wxmlPath)}: class "${className}" 在同名 WXSS 中没有定义`
      );
    }
  }
}

function validatePackageMetadata() {
  const packageJson = readJson('package.json');
  const packageLock = readJson('package-lock.json');
  if (!packageJson || !packageLock) {
    return;
  }

  const lockRoot = packageLock.packages && packageLock.packages[''];
  check(Boolean(lockRoot), 'package-lock.json: 缺少根包信息');
  if (!lockRoot) {
    return;
  }

  check(packageJson.version === packageLock.version, 'package.json 与 package-lock.json 的 version 不一致');
  check(packageJson.version === lockRoot.version, 'package.json 与锁文件根包 version 不一致');

  for (const dependencyType of ['dependencies', 'devDependencies']) {
    const manifestDependencies = packageJson[dependencyType] || {};
    const lockedDependencies = lockRoot[dependencyType] || {};
    check(
      JSON.stringify(manifestDependencies) === JSON.stringify(lockedDependencies),
      `package.json 与 package-lock.json 的 ${dependencyType} 不一致`
    );
  }
}

function validateCompanyData() {
  const dataPath = path.join(ROOT, 'data', 'companies.js');
  delete require.cache[require.resolve(dataPath)];
  const data = require(dataPath);
  const companies = data.companys;

  check(Array.isArray(companies), 'data/companies.js: companys 必须是数组（历史 API 名称暂时保留）');
  if (!Array.isArray(companies)) {
    return;
  }

  const ids = new Set();
  for (const company of companies) {
    check(Number.isInteger(company.id), 'data/companies.js: 每条记录必须包含整数 id');
    check(!ids.has(company.id), `data/companies.js: id ${company.id} 重复`);
    ids.add(company.id);
    check(Boolean(company.name), `data/companies.js: id ${company.id} 缺少 name`);
    check(Object.hasOwn(company, 'uscc'), `data/companies.js: id ${company.id} 缺少 uscc 字段`);
    check(Object.hasOwn(company, 'legal_rep_name'), `data/companies.js: id ${company.id} 缺少 legal_rep_name 字段`);
  }
}

function main() {
  const sourceFiles = collectSourceFiles(ROOT).concat(
    ROOT_TEXT_FILES.map(fileName => path.join(ROOT, fileName))
  );

  for (const filePath of sourceFiles.filter(file => path.extname(file) === '.json')) {
    readJson(relative(filePath));
  }

  validateFormatting(sourceFiles);
  validatePages(readJson('app.json'));
  validateCss(sourceFiles);
  validatePackageMetadata();
  validateCompanyData();

  if (failures.length) {
    console.error(`项目校验失败：${failures.length} 个问题`);
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`项目校验通过：${checkCount} 项检查，${sourceFiles.length} 个源码文件`);
}

main();
