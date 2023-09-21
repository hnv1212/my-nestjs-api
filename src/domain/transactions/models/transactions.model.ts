import { ApiProperty } from "@nestjs/swagger";
import { ResultsMetadata } from "src/common/models/results-metadata.model";
import { Transaction } from "./transaction.model";

export class Transactions {
    @ApiProperty({type: [Transaction]})
    data: Transaction[]

    @ApiProperty()
    meta: ResultsMetadata
}