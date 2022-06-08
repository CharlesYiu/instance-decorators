module.exports.Instance = function Instance(target, name, descriptor) {
    // method decorator or a function as an argument
    if ((typeof target) !== "undefined") {
        if (((typeof name) !== "undefined") && ((typeof descriptor) === "undefined")) throw Error("this decorator is for methods")
        // get the function from the parameters (if it's used like a decorator in a class then get it from the target and bind )
        const isFunction = ((typeof target) === "function") && ((typeof descriptor) === "undefined")
        const __action = isFunction ? target : target[name]
        // makes sure that the decorator has only 2 or 3 parameters (for properties or for methods)
        if (__action.length > 3 || __action.length < 2) throw Error("decorator has to have 2 (target, name) or 3 (target, name, descriptor) parameters")
        const isPropertyDecorator = __action.length === 2
        
        function decorator(_target, _name, _descriptor) {
            // makes sure property decorators don't get ran on a method
            if ((isPropertyDecorator && ((typeof _descriptor) !== "undefined"))) throw Error(`the decorator was not used for what it was made for (${isPropertyDecorator ? "properties" : "methods"})`)
            // create a function that the overridden constructor would run with the instance
            const action = function(thing) {
                const _action = isFunction ? __action : __action.bind(thing)
                const result = isPropertyDecorator ? _action(thing, _name) : _action(thing, _name, _descriptor) 
                if ((typeof result) !== "undefined") thing[_name] = result
                return thing
            }
            // append the action to a list for the overridden constructor to find and loop through
            if ((typeof _target["_decorators"]) === "undefined") _target["_decorators"] = [action]
            else _target["_decorators"].push(action)
        }
        if (!isFunction) target[name] = decorator
        return decorator
    }

    // class decorator
    return function(target, name, descriptor) {
        // save a copy of target
        const original = target
        // override constructor
        const construct = function(...parameters) {
            let instance = new original(...parameters)
            if ((typeof target.prototype._decorators) !== "undefined") target.prototype._decorators.forEach(decorator => {
                instance = decorator(instance)
            })
            return instance
        }
        // copy prototype
        construct.prototype = original.prototype
        return construct
    }
}
module.exports.default = module.exports.Instance