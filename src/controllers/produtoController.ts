import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

const prisma = new PrismaClient();

class ProdutoController {
    async criarProduto(req: Request, res: Response) {
        try {
            const {idVendedor, nome, descricao, condicao, valor} = req.body;
            
            const vendedor = await prisma.usuario.findUnique({
                where: {idUsuario: idVendedor},
            });

            if (!vendedor) {
                return res.status(404).json({error: "Vendedor não encontrado"});
            }
            
            const produto = await prisma.produto.create({
                data: {
                    idVendedor,
                    nome,
                    descricao,
                    condicao,
                    valor,
                },
            });

            return res.status(201).json(produto);
        } catch (error: any) {
            return res.status(500).json({ error: error.message || "Erro ao criar produto" });
        }
    }

    async listarProdutos(req: Request, res: Response) {
        try {
            const produtos = await prisma.produto.findMany();
            return res.status(200).json(produtos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: "Erro ao listar produtos"});
        }
    }

    async buscarProduto(req: Request, res: Response) {
        try {
            const {idProduto} = req.params;
            const produto = await prisma.produto.findUnique({
                where: {idProduto: Number(idProduto)},
            });
            
            if (!produto) {
                return res.status(404).json({error: "Produto não encontrado"});
            }

            return res.status(200).json(produto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar produto" });
        }
    }

    async atualizarProduto(req: Request, res: Response) {
        try {
            const {idProduto} = req.params;
            const {nome, descricao, condicao, valor} = req.body;

            const produtoExistente = await prisma.produto.findUnique({
                where: {idProduto: Number(idProduto)},
                });
                
                if (!produtoExistente) {
                    return res.status(404).json({error: "Produto não encontrado"});
                }

            const produtoAtualizado = await prisma.produto.update({
                where: {idProduto: Number(idProduto)},
                data: {nome, descricao, condicao, valor},
            });
            
            return res.status(200).json(produtoAtualizado);
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: "Erro ao atualizar produto"});
        }
    }

    async deletarProduto(req: Request, res: Response) {
        try {
            const {idProduto} = req.params;
            
            const produtoExistente = await prisma.produto.findUnique({
                where: {idProduto: Number(idProduto)},
            });
            
            if (!produtoExistente) {
                return res.status(404).json({error: "Produto não encontrado"});
            }
            
            await prisma.produto.delete({
                where: {idProduto: Number(idProduto)},
            });

            return res.status(200).json({message: "Produto deletado com sucesso"});
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: "Erro ao deletar produto"});
        }
    }
}

export default new ProdutoController();
