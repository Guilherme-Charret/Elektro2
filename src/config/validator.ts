import { body, param, ValidationChain } from "express-validator";

export class UsuarioValidator {
  public static validarUsuario(crudMethod: string) {
    switch (crudMethod) {
      case "create":
        return [

          body("nome").exists().trim(),

          body("email").exists().trim().isEmail(),

          body("endereco").exists().trim(),
        ];
        break;
      default:
        return [];
        break;
    }
  }
}

export class ProdutoValidator {
  public static validarProduto(crudMethod: string) {
    switch (crudMethod) {
      case "create":
        return [
          body("idVendedor").exists().trim().isEmail().isNumeric(),

          body("nome").exists().trim(),

          body("condicao").exists().trim(),

          body("address").exists().trim().isLength({min:10}),
        ];
        break;
      default:
        return [];
        break;
    }
  }
}