import { MyTVListError } from "./MyTVListError";

export class InvalidMediaTypeError extends MyTVListError {
    public constructor() {
        super("Invalid media type. Valid values are \"TV\", or \"Movie\"", 400);
    }
}
