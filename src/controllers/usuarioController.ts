import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";
import auth from "../config/auth";

const prisma = new PrismaClient();

class UsuarioController {
    async criarUsuario(req: Request, res: Response) {
        try {
            const {nome, email, senha, endereco, tipo} = req.body;
            const {hash, salt} = auth.generatePassword(senha);
            
            const usuario = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    hash,
                    salt,
                    endereco,
                    tipo
                },
            });
            
            return res.status(201).json({
                message: "Usuário criado com sucesso"});
            } catch(error) {
                console.error("Erro ao criar usuário:", error);

                return res.status(500).json({error: "Erro ao criar usuário"});
            }
        }

    async login(request: Request, response: Response) {
        try {  
            const {email, senha} = request.body;
            const user = await prisma.usuario.findUnique({
                where:{ email: email}
            });

            if(!user)
                return response.status(400).json({message:"usuário não existe"})

            const {hash, salt} = user

            if(!auth.checkPassword(senha, hash, salt)){
                return response.status(400).json({message:"Senha incorreta"})
            }
            const token = auth.generateJWT(user);
    
            return response.status(201).json({message:"Token enviado" ,token: token})

        } catch (error) {
            return response.status(500).json({message: "Server Error"})

        }   
    }

    async testeAutenticacao(request: Request, response: Response){
        const email = request.user as string; 

        if(!email)
            return response.status(401).json({ message: "Não autorizado" });

        return response.status(201).json({message:"acesso autorizado"})
    }

    async listarUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await prisma.usuario.findMany();

            return res.json(usuarios);
        } catch (error) {

            return res.status(500).json({error: "Erro ao buscar usuários"});
        }
    }
    
    async buscarUsuario(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const usuario = await prisma.usuario.findUnique({
                where: { idUsuario: parseInt(id) },
            });
            
            if (!usuario) {

                return res.status(404).json({error: "Usuário não encontrado"});
            }
            
            return res.json(usuario);
        } catch (error) {

            return res.status(500).json({error: "Erro ao buscar usuário"});
        }
    }
    
    async atualizarUsuario(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {nome, email, hash, salt, endereco, tipo} = req.body;
            const usuario = await prisma.usuario.update({

                where: {idUsuario: parseInt(id)},
                data: {nome, email, hash, salt, endereco, tipo},});
                
                return res.json(usuario);
            } catch (error) {

                return res.status(500).json({ error: "Erro ao atualizar usuário" });
            }
        }
        
    async deletarUsuario(req: Request, res: Response) {
        try {
            const {id} = req.params;
            await prisma.usuario.delete({where: { idUsuario: parseInt(id) }});

            return res.json({message: "Usuário deletado com sucesso"});
        } catch (error) {

            return res.status(500).json({error: "Erro ao deletar usuário"});
        }
    }  
}

export default new UsuarioController();
