import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Paciente } from '../paciente/paciente.entity'; // Cambia según donde tengas la entidad User
import { orm } from '../shared/db/orm'; // MikroORM ORM instance

const em = orm.em;

// Función para manejar el login
export async function login(req: Request, res: Response) {
  const { email, contrasena } = req.body;

  try {
    // Buscar el usuario por email
    const user = await em.findOne(Paciente, { email });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña ingresada con la almacenada (hasheada)
    const validPass = await bcrypt.compare(contrasena, user.passwordHash);
    if (!validPass) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Si las credenciales son correctas, generar el JWT
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
      throw new Error('La variable de entorno ACCESS_TOKEN_SECRET no está configurada');
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role }, // Incluimos el rol en el token
      accessTokenSecret,
      { expiresIn: '5h' }
    );

    res.json({
      id: user.id,
      accessToken: accessToken,
      role: user.role, // Devolver el rol para uso en frontend
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
}