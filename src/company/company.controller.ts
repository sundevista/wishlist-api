import {Body, Controller, Delete, Get, Param, Post, UseFilters} from '@nestjs/common';
import {CompanyExceptionFilter} from "./filter/company-exception.filter";
import {CompanyService} from "./company.service";
import {Company} from "./dto/company/company";

@Controller('company')
@UseFilters(new CompanyExceptionFilter())
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get()
    public findAll(): Company[] {
        return this.companyService.getCompanies();
    }

    @Post()
    public create(@Body() company: Company): Company {
        return this.companyService.addCompany(company.name, company.icon, company.color);
    }

    @Delete(':name')
    public delete(@Param('name') name: string): void {
        this.companyService.removeCompany(name);
    }
}
