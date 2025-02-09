const {Router} = require("express");
import UsuarioController from "../controllers/usuarioController";
import CarrinhoController from "../controllers/carrinhoController";
import ProdutoController from "../controllers/produtoController";
import FavoritosController from "../controllers/favoritosController";
import passport from "passport";
import {UsuarioValidator, ProdutoValidator} from "../config/validator";
import {ResultValidator} from "../middlewares/resultValidator";
import { photoUpload } from "../config/uploader";

const router = Router();

router.post("/usuarios", UsuarioValidator.validarUsuario("create"),
ResultValidator.validateResult, UsuarioController.criarUsuario);
router.get("/usuarios", UsuarioController.listarUsuarios);
router.get("/usuarios/:id", UsuarioController.buscarUsuario);
router.get("/login", UsuarioController.login)
router.get("/user", passport.authenticate("jwt", { session: false }), UsuarioController.testeAutenticacao)
router.put("/usuarios/:id", UsuarioController.atualizarUsuario);
router.delete("/usuarios/:id", UsuarioController.deletarUsuario);

router.post("/usuarios/img",photoUpload.single("image"))

router.post("/produtos", ProdutoValidator.validarProduto("create"),
ResultValidator.validateResult, ProdutoController.criarProduto);
router.get("/produtos", ProdutoController.listarProdutos);
router.get("/produtos/:idProduto", ProdutoController.buscarProduto);
router.put("/produtos/:idProduto", ProdutoController.atualizarProduto);
router.delete("/produtos/:idProduto", ProdutoController.deletarProduto);

router.post("/carrinho", CarrinhoController.adicionarProduto);
router.get("/carrinho/:idUsuario", CarrinhoController.visualizarCarrinho);
router.delete("/carrinho", CarrinhoController.removerProduto);

router.post("/favoritos", FavoritosController.adicionarFavorito);
router.get("/favoritos/:idUsuario", FavoritosController.listarFavoritos)
router.delete("/favoritos", FavoritosController.removerFavorito);

export default router;

