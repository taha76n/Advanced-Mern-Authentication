const TryCatch = (handler)=>{
  return async(req,res,next)=>{
    try {
      await handler(req,res,next);
    } catch (error) {
      res.status(500).json({message:error.message});
    };
  };
};

export default TryCatch;

// TryCatch is a hof whereas handler is callback fn  TryCatch returns an anonymous fn inside which has a try catch block the try calls the callback fn and catch catches the errors