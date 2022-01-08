
const deleteItem = async (model, id, force = false) => {
    return model.destroy({ where: { id }, force })
}

// warning will be deprecated on the future 
const matchCreationRightSide = async (service, intermediate, id, data, key_1 = 'id_1', key_2 = 'id_2', verification_key = 'verification_key') => {
    if (!Array.isArray(data))
        throw new Error('Data should be array')

    let arr = []
    for (let index = 0; index < data.length; index++) {

        if (data[index][verification_key] != undefined) { 
            try {
                const newItem = await service.create(data[index])
                data[index] = newItem.result
            }
            catch (e) { console.log(e) }
        }

        let obj = { }
        obj[key_1] = id,
        obj[key_2] = data[index]

        arr.push(obj)
    }

    return intermediate.bulkCreate(arr)
}


module.exports = { 
    deleteItem,
    matchCreationRightSide
}