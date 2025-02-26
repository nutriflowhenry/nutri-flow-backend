import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UsersRepository {

    // constructor(@InjectRepository(User) private repository: Repository<User>) {
    // }
}