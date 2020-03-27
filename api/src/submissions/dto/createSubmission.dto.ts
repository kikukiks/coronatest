import {
    IsString,
    IsArray,
    IsNumber,
    Min,
    IsUUID,
    Max,
    MaxLength,
    IsBoolean,
    IsObject,
    IsOptional,
    IsEnum
} from 'class-validator';

export class CreateSubmissionDto {
    @IsString()
    @MaxLength(255)
    @IsOptional()
    latitude: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    longitude: string;

    @IsEnum([
        'harju',
        'tartu',
        'ida_viru',
        'pärnu',
        'lääne_viru',
        'viljandi',
        'rapla',
        'võru',
        'saare',
        'jõgeva',
        'järva',
        'valga',
        'põlva',
        'lääne',
        'hiiu'
    ])
    @IsOptional()
    county: string;

    @IsEnum(['male', 'female'])
    @MaxLength(255)
    gender: string;

    @IsNumber()
    @Min(0)
    @Max(200)
    age: number;

    @IsBoolean()
    @IsOptional()
    high_risk_country: boolean;

    @IsBoolean()
    @IsOptional()
    exposure: boolean;

    @IsEnum(['yes', 'no', 'maybe'])
    @IsOptional()
    close_contact: string;

    @IsArray()
    symptoms: object;

    @IsNumber()
    @Min(1)
    @Max(200)
    @IsOptional()
    symptoms_duration: number;

    @Min(36)
    @Max(50)
    @IsNumber()
    @IsOptional()
    fever_temperature: number;

    @IsBoolean()
    @IsOptional()
    chronic_conditions: boolean;

    @IsBoolean()
    @IsOptional()
    has_been_tested: boolean;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    phone_number: string;

    @IsEnum(['self', 'family', 'test'])
    @IsOptional()
    intent: string;
}
