import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        SequelizeModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                dialect: 'postgres',
                host: configService.get<string>('postgres.host'),
                port: +configService.get('postgres.port'),
                username: configService.get<string>('postgres.username'),
                password: configService.get<string>('postgres.password'),
                database: configService.get<string>('postgres.database'),
                logging: false,
                autoLoadModels: true,
                synchronize: true,
                retryAttempts: 3,
                define: {
                    paranoid: true,
                    underscored: true
                },
                // sync: {
                //     force: true
                // }
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class DatabaseModule {}
