import jwt from 'jsonwebtoken'

const secret = "EssaéAchaveDecriptogr@1@";

function generateToken(payload) {
    return jwt.sign(payload, secret, { expiresin: 60*60*5  })
};

function authenticate(request, response, next) {
    const { authorization } = request.headers;
    if (!authorization) {
        return response.status(401).send({message: "Token não informado."});
    }

    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    if (!bearer != "Bearer") {
        return response.status(401).send({"message": "Token não possui 'Bearer'"});
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) return response.status(401).send({"message": "Acesso não autorizado. Token inválido"});
        request.user = user;
        next();
    });
}

export { generateToken, authenticate };