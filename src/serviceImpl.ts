import { IItemStatusArgs, InventoryService, ItemStatus, ItemStatusUnavailable } from './codegen/inventory'

const getItem = (itemId: string) => {
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
    ]

    return data.find((_) => _.itemId === itemId)
}

/**
 * Implementation of our thrift service.
 *
 * Notice the second parameter, "context" - this is the Hapi request object,
 * passed along to our service by the Hapi thrift plugin. Thus, you have access to
 * all HTTP request data from within your service implementation.
 */
export const inventoryServiceImpl = new InventoryService.Processor({
    get: (itemId: string, context: Request): Promise<ItemStatus> => {
        return new Promise((resolve, reject) => {
            const item = getItem(itemId)
            if (item) {
                resolve(new ItemStatus(item))
            } else {
                reject(new ItemStatusUnavailable())
            }
        })
    },
    reduce: (itemId: string, qty: number, context: Request): Promise<ItemStatus> => {
        return new Promise((resolve, reject) => {
            const item = getItem(itemId)
            if (item) {
                item.qty = item.qty - qty
                resolve(new ItemStatus(item))
            } else {
                reject(new ItemStatusUnavailable())
            }
        })
    },
})
