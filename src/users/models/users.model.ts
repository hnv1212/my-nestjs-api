import { ResultsMetadata } from "src/common/models/results-metadata.model";
import { User } from "./user.model";
import { ApiProperty } from "@nestjs/swagger";

export class Users {
    @ApiProperty()
    data: User[]

    @ApiProperty()
    meta: ResultsMetadata
}