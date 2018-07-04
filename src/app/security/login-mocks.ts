import { AppUserAuth } from "./app-user-auth";

export const LOGIN_MOCKS: AppUserAuth[] = [{
    userName:"Majesova",
    bearerToken:"thisisatoken12345",
    isAuthenticated:true,
    claims:[] 
},
{
    userName:"Jesus",
    bearerToken:"thisisanothertoken54321",
    isAuthenticated:true,
    claims:[]
}];
