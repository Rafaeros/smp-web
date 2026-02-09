
export interface CreateProduct {
    code: string,
    description: string
}

export interface UpdateProduct {
    code?: string,
    description?: string
}


export interface Product {
    id: number,
    code: string,
    description: string
}