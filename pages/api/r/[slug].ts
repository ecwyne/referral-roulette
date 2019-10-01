import { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../lib/fauna';
import { query as q } from 'faunadb';
import sample from 'lodash.sample';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const slug = req.query.slug as string;
    console.log(slug);

    client
        .query<string[]>(
            q.Select(
                'data',
                q.Paginate(q.Match(q.Index('links_by_slug'), slug)),
            ),
        )
        .then(arr => {
            console.log(arr);
            if (arr.length) {
                const url = sample(arr);
                res.setHeader('location', url);
                res.status(302).end();
            } else {
                res.status(404).end();
            }
        })
        .catch(() => res.status(500).end());
};

export default handler;
