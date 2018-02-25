import { IItemStatusArgs, InventoryService, ItemStatus, ItemStatusException } from './codegen/inventory'

const data = [
    {
        itemId: '1001',
        qty: 5,
    },
    {
        itemId: '1002',
        qty: 3,
    },
    {
        itemId: '1010',
        qty: 12,
    },
].map((item) => new ItemStatus(item))

const getItem = (itemId: string) =>
    data.find((_) => _.itemId === itemId)

const notFoundException = () =>
    new ItemStatusException({
        id: 1,
        message: 'Not found',
    })

/**
 * Implementation of our thrift service.
 *
 * Notice the second parameter, "context" - this is the Hapi request object,
 * passed along to our service by the Hapi thrift plugin. Thus, you have access to
 * all HTTP request data from within your service implementation.
 */
export const inventoryServiceImpl = new InventoryService.Processor({
    get: (itemId: string, context?: Request): Promise<ItemStatus> => {
        return new Promise((resolve, reject) => {
            const item = getItem(itemId)
            if (item) {
                resolve(item)
            } else {
                reject(notFoundException())
            }
        })
    },
    reduce: (itemId: string, qty: number, context?: Request): Promise<ItemStatus> => {
        return new Promise((resolve, reject) => {
            const item = getItem(itemId)
            if (item && item.qty > 0) {
                item.qty = item.qty - qty
                resolve(item)
            } else if (item) {
                reject(new ItemStatusException({
                    id: 2,
                    message: 'Inventory Unavailable',
                }))
            } else {
                reject(notFoundException())
            }
        })
    },
})
