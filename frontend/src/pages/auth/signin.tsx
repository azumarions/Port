import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/app/store';
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
    selectIsLoadingAuth,
    fetchCredStart,
    fetchCredEnd,
    fetchAsyncLogin,
    fetchAsyncRegister,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
    fetchAsyncCreateProf,
  } from '../../redux/auth/slices';
import { PROPS_AUTHEN } from 'redux/auth/types';


const SigninForm = () => {
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const dispatch: AppDispatch = useDispatch();
  const { register, handleSubmit, formState: { errors} } = useForm<PROPS_AUTHEN>();
  const onSubmit = async (data: PROPS_AUTHEN) => {
    await dispatch(fetchCredStart());
    const resultReg = await dispatch(fetchAsyncRegister(data));

    if (fetchAsyncRegister.fulfilled.match(resultReg)) {
      await dispatch(fetchAsyncLogin(data));
      await dispatch(fetchAsyncCreateProf({ name: "anonymous" }));

      await dispatch(fetchAsyncGetProfs());
      await dispatch(fetchAsyncGetMyProf());
      }
      await dispatch(fetchCredEnd());
  }



  return (
    <form onSubmit={handleSubmit(onSubmit)}
    >
    </form>
  );
};

export default SigninForm;