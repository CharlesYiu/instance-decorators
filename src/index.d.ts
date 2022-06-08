declare module "instance-decorators" {
    export type InstanceDecorator = (_target: any, _name: string, _descriptor?: PropertyDescriptor) => void
    export type InstanceAction = ((target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) => any) | ((target: Thing, propertyKey: string) => any)
    
    export function Instance(): ((target: any) => any)
    export function Instance(action: InstanceAction): InstanceDecorator
    export function Instance(target?: any, name?: string, descriptor?: PropertyDescriptor): (((target: any) => any) | InstanceDecorator | void)
    export default Instance
}
