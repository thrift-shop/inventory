struct ItemStatus {
    1: required string itemId;
    2: required i32 qty;
}

exception ItemStatusException {
    1: string message;
    2: required i32 id;
}

service InventoryService {
    ItemStatus get(string itemId) throws (1: ItemStatusException itemException)
    ItemStatus reduce(string itemId, i32 qty) throws (1: ItemStatusException itemException)
}
