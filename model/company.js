import { DataSource } from './datasource';

class Company {
  static async getByCity(cityName) {
    return DataSource.getCompaniesByCity(cityName);
  }

  static async searchByKeyword(keyword) {
    return DataSource.searchCompanies(keyword);
  }

  static async getById(id) {
    return DataSource.getCompanyById(id);
  }

  static async addCompanyInfo(companyData) {
    return DataSource.addCompany(companyData);
  }
}

export {
  Company
};
