declare module "instance-decorators" {
    export type InstanceDecorator = (_target: any, _name: string, _descriptor?: PropertyDescriptor) => void
    export type InstanceAction<Thing> = ((target: Thing, propertyKey: string, propertyDescriptor: PropertyDescriptor) => any) | ((target: Thing, propertyKey: string) => any)
    
    export function Instance<Thing>(): (<Thing>(target: any) => any)
    export function Instance<Thing>(action: InstanceAction<Thing>): InstanceDecorator
    export function Instance<Thing>(target?: any, name?: string, descriptor?: PropertyDescriptor): (((target: any) => any) | InstanceDecorator | void)
    export default Instance
}
