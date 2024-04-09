export async function checkEnvironments(){
    let missingEnvironments = [];

    if(!process.env.PORT){
        missingEnvironments.push("PORT");
    }
    if(!process.env.NODE_ENV){
        missingEnvironments.push("NODE_ENV");
    }
    if(!process.env.DB){
        missingEnvironments.push("DB");
    }
    if(!process.env.JWT){
        missingEnvironments.push("JWT");
    }
    if(!process.env.SALT_ROUNDS){
        missingEnvironments.push("SALT_ROUNDS");
    }
    if(!process.env.ADMIN_EMAIL){
        missingEnvironments.push("ADMIN_EMAIL");
    }
    if(!process.env.EMAIL_HOST){
        missingEnvironments.push("EMAIL_HOST");
    }
    if(!process.env.EMAIL_PORT){
        missingEnvironments.push("EMAIL_PORT");
    }
    if(!process.env.EMAIL_SECURE){
        missingEnvironments.push("EMAIL_SECURE");
    }
    if(!process.env.EMAIL_USER){
        missingEnvironments.push("EMAIL_USER");
    }
    if(!process.env.EMAIL_PASS){
        missingEnvironments.push("EMAIL_PASS");
    }
    if(!process.env.EMAIL_VERIFICATION_URL){
        missingEnvironments.push("EMAIL_VERIFICATION_URL");
    }
    if(!process.env.ORIGIN){
        missingEnvironments.push("ORIGIN");
    }
    if(missingEnvironments.length > 0){
        console.log("Missing environments: " + missingEnvironments.join(", "));
        return process.exit(1);
    }
    return;
}