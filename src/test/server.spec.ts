import {
    createClient,
} from '@creditkarma/thrift-client'

import * as childProcess from 'child_process'
import { expect } from 'code'
import * as Lab from 'lab'
import { CoreOptions } from 'request'

import {
    InventoryService,
    ItemStatus,
} from '../codegen/inventory'

export const lab = Lab.script()

const describe = lab.describe
const it = lab.it
const before = lab.before
const after = lab.after

describe('Thrift Server Hapi', () => {
    let server: any
    let client: InventoryService.Client<CoreOptions>

    before((done: any) => {
        server = childProcess.fork('./dist/server.js')
        client = createClient(InventoryService.Client, {
            hostName: '0.0.0.0',
            port: parseInt(process.env.PORT || '3020', 10),
        })
        setTimeout(done, 1000)
    })

    it('should return an item with qty of 5 for item 1001', async () => {
        return client.get('1001').then((response: ItemStatus) => {
            expect(response).to.exist()
            expect(response.qty).to.equal(5)
        })
    })

    after((done: any) => {
        server.kill('SIGINT')
        setTimeout(done, 1000)
    })
})
