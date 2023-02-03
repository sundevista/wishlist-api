import { Injectable } from '@nestjs/common';
import { Integration } from 'src/integration/dto/integration/integration';
import { IntegrationException } from 'src/integration/exception/integration.exception';
import { Wish } from './dto/wish/wish';
import { WishException } from './exception/wish.exception';
import { link } from 'fs';

@Injectable()
export class WishService {
    private wishes: Wish[] =[
        {   
            name: 'Rei Plush',
            descriprion: 'plush version of Ayanami Rei from Evangelion Anime',
            price: 20,
            reserved_by: null,
            //integrations: Integration[],
        },
    ];
    public getWish(): Wish[]{
        return this.wishes;
    }
    // public addWish(name:'string',  integration:Integration[], reserved_by:null| number): Wish{

    // }
}
