import { FastifyReply, FastifyRequest } from 'fastify';
import { RegisterDTO, LoginDTO } from '@elo-organico/shared';

export async function registerHandler(
  request: FastifyRequest<{ Body: RegisterDTO }>,
  reply: FastifyReply
) {
  const { User } = request.server.models;
  const { email, username, password, icon } = request.body;
  
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    const message = existingUser.email === email 
      ? 'Email já cadastrado.' 
      : 'Nome de usuário já existe.';
    return reply.status(409).send({ message });
  }

  const newUser = new User({ email, username, password, icon, role: 'user' });
  await newUser.save();
  
  return reply.status(201).send({ message: 'Usuário criado com sucesso' });
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginDTO }>,
  reply: FastifyReply
) {
  const server = request.server;
  const { User, Product, Cycle } = server.models;
  const { identifier, password } = request.body;
  
  const user = await User.findOne({ 
    $or: [{ email: identifier }, { username: identifier }] 
  }).select('+password');

  if (!user || !(await server.compareHash(password, user.password!))) {
    return reply.status(401).send({ authenticated: false, message: 'Credenciais inválidas' });
  }

  const token = server.jwt.sign({ 
    _id: user.id, 
    icon: user.icon, 
    email: user.email, 
    username: user.username, 
    role: user.role 
  });
  
  request.session.token = token;
  
  const products = await Product.find({});
  const activeCycle = await Cycle.findOne({ isActive: true }).populate('products');

  return reply.send({ 
    authenticated: true, 
    token,
    user: {
      email: user.email,
      username: user.username,
      role: user.role,
      icon: user.icon
    },
    products,
    cycle: activeCycle
  });
}

export async function logoutHandler(request: FastifyRequest, reply: FastifyReply) {
  if (request.session) {
    await request.session.destroy();
  }
  return reply.send({ message: 'Logout realizado com sucesso' });
}

export async function verifyHandler(request: FastifyRequest, reply: FastifyReply) {
  const server = request.server;
  if (!request.session.token) {
    return reply.status(401).send({ message: "Sessão não encontrada." });
  }

  try {
    const payload = server.jwt.verify(request.session.token) as { _id: string };
    const { User, Product, Cycle } = server.models;
    
    const user = await User.findById(payload._id);
    
    if (!user) {
      return reply.status(404).send({ message: "Usuário não encontrado." });
    }

    const products = await Product.find({});
    const activeCycle = await Cycle.findOne({ isActive: true }).populate('products');
    
    return reply.send({ 
      authenticated: true, 
      token: request.session.token,
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
        icon: user.icon
      },
      products,
      cycle: activeCycle
    });

  } catch (err) {
    return reply.status(401).send({ message: "Token inválido ou expirado." });
  }
}