export enum ConstantsEnum {
    MODULE_LOCAL_SCOPE_METADATA = '__module:local:scope__',
    MODULE_GLOBAL_SCOPE_METADATA = '__module:global:scope__',
    PARAMTYPES_METADATA = 'design:paramtypes',
    BASE_PATH = 'base_path',
    ROUTERS_METADATA = '__routers__',
    ROUTE_ARGS_METADATA = '__routeArguments__',
    ROUTE_VERSION_METADATA = '__version__',
    USE_METHOD_METADATA = 'use:method',
    USE_CONTROLLER_METADATA = 'use:controller',
    INCOMING_MESSAGES_METADATA = '__incoming_messages__',
    INJECTABLE_METADATA = '__injectable__',
    IDENTIFIER_METADATA = '__identifier__',
    RESPONSE_PASSTHROUGH_METADATA = '__responsePassthrough__',
    HTTP_CODE_METADATA = '__httpCode__'
}

export enum ModuleMetadataEnum {
    IMPORTS = 'imports',
    CONTROLLERS = 'controllers',
    PROVIDERS = 'providers',
    EXPORTS = 'exports'
}
export const MODULE_METADATA = [
    ModuleMetadataEnum.IMPORTS,
    ModuleMetadataEnum.CONTROLLERS,
    ModuleMetadataEnum.PROVIDERS,
    ModuleMetadataEnum.EXPORTS
];
