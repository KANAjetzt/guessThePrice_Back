import catchAsync from '../../utils/catchAsync';

export const getOne = (Model: any, popOptions = '') =>
  catchAsync(async (req: any, res: any, next: any) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    console.log('hellow?');
    console.log(doc);

    return doc;
    // res.status(200).json({
    //   status: 'success',
    //   data: {
    //     data: doc
    //   }
    // });
  });
