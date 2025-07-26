import Plunk from '@plunk/node';
import validator from 'validator';
import { NextResponse } from 'next/server';

const plunk = new Plunk(process.env.PLUNK_API_KEY);

export async function POST(request) {
  try {
    const { name, email, province, municipality, locality, school, message } = await request.json();

    // Validation
    if (!name || !email || !province || !municipality || !locality || !school) {
      return NextResponse.json({ message: 'Todos los campos obligatorios deben ser completados' }, { status: 400 });
    }

    // Email validation
    //const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validator.isEmail(email)) {
      return NextResponse.json({ message: 'El email proporcionado no es válido' }, { status: 400 });
    }

    // Send email using Plunk
    await plunk.emails.send({
      to: email, // Send confirmation email to the user
      subject: 'Confirmación de solicitud de información',
      body: `
        <h1>Gracias por tu solicitud, ${name}!</h1>
        <p>Hemos recibido tu solicitud desde ${school} (${locality}, ${municipality}, ${province}).</p>
        <p>Mensaje: ${message || 'No se proporcionó mensaje.'}</p>
        <p>Te contactaremos pronto para proporcionarte más información.</p>
        <p>Atentamente,<br>El equipo de [Nombre de tu plataforma]</p>
      `,
    });

    // Optionally, send a notification email to your team
    await plunk.emails.send({
      to: 'your-team-email@domain.com', // Replace with your team's email
      subject: 'Nueva solicitud de contacto',
      body: `
        <h1>Nueva solicitud recibida</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Provincia:</strong> ${province}</p>
        <p><strong>Municipio:</strong> ${municipality}</p>
        <p><strong>Localidad:</strong> ${locality}</p>
        <p><strong>Centro Educativo:</strong> ${school}</p>
        <p><strong>Mensaje:</strong> ${message || 'No se proporcionó mensaje.'}</p>
      `,
    });

    return NextResponse.json({
      message: 'Solicitud enviada correctamente',
      success: true,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        message: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.',
        success: false,
      },
      { status: 500 }
    );
  }
}
