import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/app/store';
import {
    selectIsLoadingAuth,
    fetchCredStart,
    fetchCredEnd,
    fetchAsyncLogin,
    fetchAsyncRegister,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
    fetchAsyncCreateProf,
  } from "../../redux/auth/slices";
  
export type SignupFormData = {
    username: string
    password: string
}

const Signup = () => {
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const dispatch: AppDispatch = useDispatch();
  const { register, handleSubmit, formState: { errors} } = useForm<SignupFormData>();
  return (
    <form
            onSubmit={async (values) => {
              await dispatch(fetchCredStart());
              const resultReg = await dispatch(fetchAsyncRegister(values)));
  
              if (fetchAsyncRegister.fulfilled.match(resultReg)) {
                await dispatch(fetchAsyncLogin(values));
                await dispatch(fetchAsyncCreateProf({ name: "anonymous" }));
  
                await dispatch(fetchAsyncGetProfs());
                await dispatch(fetchAsyncGetMyProf());
              }
              await dispatch(fetchCredEnd());
            }}
    >
    </form>
  );
};
export default Signup;