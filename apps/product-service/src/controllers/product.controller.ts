import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/product-db";

export const createProduct = async (req: Request, res: Response) => {
    const data: Prisma.ProductCreateInput = req.body;

    const { colors, images } = data;

    if (!colors || !Array.isArray(colors) || colors.length === 0) {
        return res.status(400).json({ message: "Colors array is required!" })
    }

    if (!images || typeof images !== "object") {
        return res.status(400).json({ message: "Images object is required!" })
    }

    const missingColors = colors.filter((color) => !(color in images));

    if (missingColors.length > 0) {
        return res.status(400).json({ message: "Missing images for colors!", missingColors })
    }

    const product = await prisma.product.create({ data });

    res.status(201).json(product);
}

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data: Prisma.ProductUpdateInput = req.body;

    const updateProduct = await prisma.product.update({
        where: { id: Number(id) },
        data,
    });

    res.status(200).json(updateProduct);
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleteProduct = await prisma.product.delete(({ 
        where: { id: Number(id) }
     }));

     res.status(200).json(deleteProduct);
}

export const getProducts = async (req: Request, res: Response) => {
    const { sort, category, search, limit } = req.query;
    const orderBy = (() => {
        switch (sort) {
            case "asc":
                return { price: Prisma.SortOrder.asc };
            case "desc":
                return { price: Prisma.SortOrder.desc };
            case "oldest":
                return { createdAt: Prisma.SortOrder.asc };
            default:
                return { createdAt: Prisma.SortOrder.desc };
        }
    })();

    const product = await prisma.product.findMany({
        where: {
            category: {
                slug: category as string
            },
            name: {
                contains: search as string,
                mode: "insensitive"
            }
        },
        orderBy,
        take: limit ? Number(limit) : undefined,
    });

    res.status(200).json(product);
}

export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
        where: { id: Number(id) },
    });

    res.status(200).json(product);
}