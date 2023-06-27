import { FriendshipStatus } from "../entity/friendship.entity";

export class ValidationUtils {
    static isNull(obj: any) {
        return obj == undefined || obj == null;
    }

    static isEmpty(str) {
        return str == "" || ValidationUtils.isNull(str);
    }

    static isAnyStringEmpty(...strs) {
        for (let str of strs) {
            if (this.isEmpty(str)) return true;
        }
        return false;
    }

    static isPositiveNumber(str) {
        const numberRegex = /^[0-9]*[1-9][0-9]*$/;
        return numberRegex.test(str);
    }

    static isValidEmail(str) {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(str);
    }

    static validateUserLoggedIn(req, res) {
        const user = req["user"];
        if (ValidationUtils.isEmpty(user)) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return false;
        }
        return true;
    }

    static async areFriends(friendshipRepository, userId1, userId2) {
        if (this.isNull(userId1) || this.isNull(userId2)) return false;

        return await friendshipRepository.exist({
            where: [
                {
                    UserId1: userId1,
                    UserId2: userId2,
                    Status: FriendshipStatus.ACCEPTED,
                },
                {
                    UserId1: userId2,
                    UserId2: userId1,
                    Status: FriendshipStatus.ACCEPTED,
                },
            ],
        });
    }
}
