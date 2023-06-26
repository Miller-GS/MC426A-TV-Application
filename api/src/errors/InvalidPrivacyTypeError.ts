import { MyTVListError } from "./MyTVListError";

export class InvalidPrivacyTypeError extends MyTVListError {
    public constructor() {
        super(
            'Invalid privacy type. Valid values are "Public", "Private" or "FriendsOnly"',
            400
        );
    }
}
