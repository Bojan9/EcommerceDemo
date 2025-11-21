import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/product-db";

export const createCategory = async (req:Request, res:Response) => {
    const data: Prisma.CategoryCreateInput = req.body;
    const category = await prisma.category.create({ data });
    
    res.status(201).json(category);
}

export const updateCategory = async (req:Request, res:Response) => {
    const { id } = req.params;
    const data: Prisma.CategoryUpdateInput = req.body;

    const updateCategory = await prisma.category.update({
        where: { id: Number(id) },
        data,
    });

    res.status(200).json(updateCategory);
}

export const deleteCategory = async (req:Request, res:Response) => {
    const { id } = req.params;

    const deleteCategory = await prisma.category.delete(({ 
        where: { id: Number(id) }
     }));

     res.status(200).json(deleteCategory);
}

export const getCategories = async (req:Request, res:Response) => {
    const categories = await prisma.category.findMany();

    res.status(200).json(categories);
}
