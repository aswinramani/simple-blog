import { ConfigModuleOptions } from "@nestjs/config";
import configuration from "./configuration";

export const configOptions: ConfigModuleOptions = {
  envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
  load: [configuration],
};
