const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error) => next(error));
    }    
}

export {asyncHandler}

// can do above or below

// const asyncHandler = (fun) => async (req, res, next) => {
//     try {
//         await fun(req, res, next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             error: err.message
//         })
//     }
// }