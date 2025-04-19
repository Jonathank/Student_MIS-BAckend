
import { Code} from "../enum/Code.enum";
import { Status } from "../enum/Status.enum";

export class HttpResponse{
    private timeStamp : String;

    constructor(private statusCode:Code, private httpStatus: Status, private message : string, private data?:{}){
        this.timeStamp = new Date().toLocaleString();
        this.statusCode = statusCode;
        this.httpStatus = httpStatus;
        this.message = message;
        this.data = data;
    }
}