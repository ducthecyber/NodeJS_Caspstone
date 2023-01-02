// 200 , 400 , 500
export const successCode = (res, data, message) => {
    res.status(200).json({
        message,
        content: data
    });
}

//400
export const failCode = (res, data, message) => {
    res.status(400).json({
        message,
        content: data
    });
}

//404
export const notFoundCode = (res, data, message) => {
    res.status(404).send(message);

    // res.status(404).json({
    //     message,
    //     content: data
    // });
}

//500
export const errorCode = (res,message) => {
    res.status(500).send(message);
}

//note
// module.exports = {
//     successCode,
//     failCode,
//     errorCode,
//     notFoundCode
// }