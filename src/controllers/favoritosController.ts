import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express"; 

const prisma = new PrismaClient();

class FavoritosController {
    async adicionarFavorito(req: Request, res: Response) {
        try {
            const {idUsuario, idProduto} = req.body;
            
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

                return res.status(404).json({error: "Produto não encontrado"});
            }
            
            const favoritos = await prisma.favoritos.upsert({
                where: {idUsuario},
                update: {produtos: {connect: {idProduto}}},
                create: {
                    idUsuario,
                    produtos: {connect: {idProduto}},
                },
                include: {produtos: true},
            });
            
            return res.status(201).json(favoritos);
        } catch (error) {
            console.error(error);

            return res.status(500).json({ error: "Erro ao adicionar favorito"});
        }
    }

    async listarFavoritos(req: Request, res: Response) {
        try {
            const {idUsuario} = req.params;
            
            const favoritos = await prisma.favoritos.findUnique({
                where: {idUsuario: Number(idUsuario)},
                include: {produtos: true},
            });
            
            if (!favoritos) {

                return res.status(404).json({error: "Usuário não possui favoritos"});
            }
            
            return res.status(200).json(favoritos.produtos);
        } catch (error) {
            console.error(error);

            return res.status(500).json({ error: "Erro ao buscar favoritos"});
        }
    }
    
    async removerFavorito(req: Request, res: Response) {
        try {
            const {idUsuario, idProduto} = req.body;
            
            const favoritoExistente = await prisma.favoritos.findUnique({
                where: {idUsuario},
                include: {produtos: true},
            });
            
            if (!favoritoExistente || !favoritoExistente.produtos.some((p: {idProduto: any;}) => p.idProduto === idProduto)) {

                return res.status(404).json({ error: "Produto não encontrado na lista de favoritos" });
            }
            
            const favoritosAtualizados = await prisma.favoritos.update({
                where: {idUsuario},
                data: {
                    produtos: {disconnect: {idProduto}},
                },
                include: {produtos: true},
            });
            
            return res.status(200).json(favoritosAtualizados);
        } catch (error) {
            console.error(error);
            
            return res.status(500).json({ error: "Erro ao remover favorito" });
        }
    }
}

export default new FavoritosController();


