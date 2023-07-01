import { useState } from "react";
import { PublicInput } from '../components/general/PublicInput';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
import userIcon from '../assets/images/user.svg';
import mailIcon from '../assets/images/mail.svg';
import passwordIcon from '../assets/images/key.svg';
import { AvatarInput } from "../components/general/AvatarInput";
import { RegisterServices } from "../services/RegisterServices";

const registerServices = new RegisterServices();

export const Register = () =>{
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [image, setImage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const doRegister = async () => {
        try {
            setError('');
            if (!image || image.trim().length < 1
                || !name || name.trim().length < 2
                || !email || email.trim().length < 5
                || !password || password.trim().length < 4
                || !passwordConfirm || passwordConfirm.trim().length < 4
                ) {
                return setError('Favor preencher os campos correctamente.');
                }

            if (password !== passwordConfirm) {
                return setError('Senha e confirmção são diferentes.');
            }    
            setLoading(true);

            const body = {
                name,
                email,
                password,
                avatar: image
            };

            await registerServices.register(body)
            setLoading(false);
            return navigate('/?success=true');
        } catch (e: any) {
            console.log('Erro ao efetuar o cadastro:', e);
            setLoading(false);
            if(e?.response?.data?.message){
                return setError(e?.response?.data?.message);
            }
            return setError('Erro ao efetuar o cadastro, tente novamente.');
        }
    }

    return (
        <div className="container-public register">
            <img src={logo} alt='Logo devameet' className='logo'/>
            <form>
                <AvatarInput image={image} setImage={setImage} />

                {error && <p className='error'>{error}</p>}
                <PublicInput 
                    icon={userIcon} alt='Nome completo' name='Nome Completo'
                    type="text" modelValue={name} setValue={setName}
                />
                <PublicInput 
                    icon={mailIcon} alt='Email' name='Email'
                    type="text" modelValue={email} setValue={setEmail}
                />
                <PublicInput 
                    icon={passwordIcon} alt='Senha' name='Senha'
                    type="password" modelValue={password} setValue={setPassword}
                />
                <PublicInput 
                    icon={passwordIcon} alt='Confirmar Senha' name='Confirmar Senha'
                    type="password" modelValue={passwordConfirm} setValue={setPasswordConfirm}
                />
                
                <button type='button' onClick={doRegister} disabled={loading}>
                    {loading ? '...Carregando' : 'Cadastrar'}
                </button>

                <div className='link'>
                    <p>Já possui uma conta?</p>
                    <Link to="/">Faça seu login agora!</Link>
                </div>
            </form>
        </div>
    )
}