import { useState } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'

function Usuario({ setUsuario }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [modo, setModo] = useState('login')
    const [mensaje, setMensaje] = useState('')
    const navigate = useNavigate()

    const manejarEnvio = async (e) => {
        e.preventDefault()

        if (modo === 'login') {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) setMensaje(error.message)
            else {
                setUsuario(data.user)
                setMensaje('Inicio de sesión exitoso ✅')
                navigate('/menu')
            }
        } else {
            const {error} = await supabase.auth.signUp({
                email,
                password,
            })
            if (error) setMensaje(error.message)
            else setMensaje('Usuario registrado. Revisa tu correo 📩')
        }
    }

    return (
        <div className="login-container">
            <h1 className="login.header">
                {modo === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </h1>

            <form onSubmit={manejarEnvio} className="login.form">
                <input
                    type="email"
                    placeholder="Correo"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="login-button"
                >
                    {modo === 'login' ? 'Entrar' : 'Registrarse'}
                </button>
            </form>

            <p className="login-message">{mensaje}</p>

            <button
                onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}
                className="login-switch-button"
            >
                {modo === 'login'
                    ? '¿No tienes cuenta? Regístrate'
                    : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
        </div>
    )
}

export default Usuario