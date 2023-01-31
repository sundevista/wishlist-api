import { Injectable } from '@nestjs/common';
import {Company} from "./dto/company/company";
import {CompanyException} from "./exception/company.exception";

@Injectable()
export class CompanyService {
    private companies: Company[] = [
        { name: "Rozetka", icon: "", color: "#00a046" },
        { name: "Yakaboo", icon: "", color: "#EA33C0" },
    ];

    public getCompanies(): Company[] {
        return this.companies;
    }

    public addCompany(name: string, icon: string, color: string): Company {
        if (name.length < 4 || icon.length < 4 || color.length !== 7) {
            throw new CompanyException('Company property is too short!');
        }

        const newCompany = {name: name, icon: icon, color: color};
        this.companies.push(newCompany);

        return newCompany;
    }

    public removeCompany(name: string): void {
        const resultingArray: Company[] = this.companies.filter(company => company.name !== name);

        if (resultingArray.length === this.companies.length) {
            throw new CompanyException('No company found');
        }

        this.companies = resultingArray;
    }
}
