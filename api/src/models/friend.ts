import { UserEntity } from "../entity/user.entity";

export interface Friend {
    id: number;
    name: string;
    birthday: Date;
    email: string;
}

export class FriendParser {
    static parseUserToFriend(user: UserEntity): Friend {
        return {
            id: user.Id,
            name: user.Name,
            birthday: user.Birthday,
            email: user.Email,
        };
    }
}
