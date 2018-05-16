/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Utilerias{
    //FUNCIÓN PARA OBTENER UN NÚMERO ALEATORIO
    static aleatoria(min, max){
        return Math.floor(Math.random() * (max - min) + 1) + min;
    }
    
    //FUNCION PARA ENVAR 0 EN VALORES NAN
    static NaNInt(variable){
        if (isNaN(variable)) {
            variable = 0;
        }
        return variable;
    }
}

