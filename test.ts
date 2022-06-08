const { Instance, InstanceDecorator } = require("./src/index")

// create instance decorators
const MethodDecorator: typeof InstanceDecorator = Instance(function(target: TestClass, name: string, propertyDescriptor: PropertyDescriptor) {
    console.log(`@MethodDecorator:\nTestClass.constructed: ${target.constructed}\n${name}()'s return value: ${target[name]()}\nproperty descriptor: ${JSON.stringify(propertyDescriptor)}\n\n`)
})
const PropertyDecorator: typeof InstanceDecorator = Instance(function(target: TestClass, name: string) {
    console.log(`@PropertyDecorator:\nTestClass.constructed: ${target.constructed}\n${name}: ${target[name]}\n\n`)
})

class Decorators {
    @Instance
    static MethodDecorator(target: TestClass, name: string, propertyDescriptor: PropertyDescriptor) {
        console.log(`@Decorators.MethodDecorator:\nTestClass.constructed: ${target.constructed}\n${name}()'s return value: ${target[name]()}\nproperty descriptor: ${JSON.stringify(propertyDescriptor)}\n\n`)
    }
}

// initialize instance decorators for it to work
@Instance()
class TestClass {
    // if constructed is false on the decorator's test than the library did not construct TestClass
    constructed = false
    constructor() {
        Object.defineProperty
        this.constructed = true
    }

    // tests instance method decorators
    // the value shown in the log statement should be "TestClass.method()'s return value"
    @MethodDecorator
    @Decorators.MethodDecorator
    method() {
        return "TestClass.method()'s return value"
    }

    // tests instance property decorators
    // the value shown in the log statement should be "TestClass.property's value"
    @PropertyDecorator
    property = "TestClass.property's value"
}

// if anything is printed before "Constructing TestClass.." than something should have not worked
console.log("Constructing TestClass..\n\n")
new TestClass()
console.log("Finished Constructing")