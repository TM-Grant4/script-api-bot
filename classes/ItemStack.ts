class ItemStack {
    itemTypeId: string = ``;
    /**
     * @param typeId Creates an itemStack with the typeId of this param
     */
    constructor(typeId: string) {
        this.itemTypeId = typeId;
    }
}

export { ItemStack };