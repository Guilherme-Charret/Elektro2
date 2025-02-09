import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

const prisma = new PrismaClient();

class CarrinhoController {
    async adicionarProduto(req: Request, res: Response) {
        try {
            const {idUsuario, idProduto, quantidade} = req.body;
          
            const usuario = await prisma.usuario.findUnique({
                where: {idUsuario},
            });
            
            if (!usuario) {
                
                return res.status(404).json({error: "Usuário não encontrado"});
            }
            
            const produto = await prisma.produto.findUnique({
                where: {idProduto},
            });
            
            if (!produto) {

                return res.status(404).json({ error: "Produto não encontrado"});
            }
            
            let carrinho = await prisma.carrinho.findUnique({
                where: {idUsuario},
                include: {produtos: true}
            });
            
            if (!carrinho) {
                carrinho = await prisma.carrinho.create({
                    data: {
                        idUsuario,
                        valorTotal: produto.valor * quantidade,
                        produtos: {connect: {idProduto}}
                    },
                    include: {produtos: true}
                });
            } else {
                carrinho = await prisma.carrinho.update({
                    where: {idUsuario},
                    data: {
                        produtos: { connect: {idProduto}},
                        valorTotal: {increment: produto.valor * quantidade}
                    },
                    include: {produtos: true}
                });
            }

            return res.status(201).json(carrinho);
        } catch (error) {
            console.error(error);

            return res.status(500).json({error: "Erro ao adicionar produto ao carrinho"});
        }
    }

    async visualizarCarrinho(req: Request, res: Response) {
        try {
            const {idUsuario} = req.params;
            const carrinho = await prisma.carrinho.findUnique({
                where: {idUsuario: Number(idUsuario)},
                include: {produtos: true}
            });
            
            if (!carrinho) {

                return res.status(404).json({error: "Carrinho não encontrado"});
            }

            return res.status(200).json(carrinho);
        } catch (error) {
            console.error(error);

            return res.status(500).json({error: "Erro ao visualizar carrinho"});
        }
    }
    
    async removerProduto(req: Request, res: Response) {
        try {
            const {idUsuario, idProduto} = req.body;
            
            const carrinho = await prisma.carrinho.findUnique({
                where: {idUsuario},
                include: {produtos: true}
            });
            
            if (!carrinho) {
                return res.status(404).json({error: "Carrinho não encontrado"});
            }
            
            if (!carrinho.produtos.some((p: {idProduto: any;}) => p.idProduto === idProduto)) {
                return res.status(404).json({error: "Produto não encontrado no carrinho"});
            }
            
            const produto = await prisma.produto.findUnique({where: {idProduto}});
            const carrinhoAtualizado = await prisma.carrinho.update({
                where: {idUsuario},
                data: {
                    produtos: {disconnect: {idProduto}},
                    valorTotal: {decrement: produto!.valor}
                },
                include: {produtos: true}
            });
            
            return res.status(200).json(carrinhoAtualizado);
        } catch (error) {
            console.error(error);

            return res.status(500).json({error: "Erro ao remover produto do carrinho"});
        }
    }
}

export default new CarrinhoController();
