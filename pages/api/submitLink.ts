import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'url';
import { createHash } from 'crypto';
import { client } from '../../lib/fauna';
import { query as q } from 'faunadb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const url = req.body as string;
    const hostname = parse(url).hostname.toLowerCase();

    const hash = createHash('sha256');

    hash.update(hostname);

    const slug = hash
        .digest()
        .toString('hex')
        .substr(0, 8);

    client
        .query<string>(
            q.Select(
                ['ref', 'id'],
                q.Create(q.Collection('links'), { data: { url, slug } }),
            ),
        )
        .then(id => res.json({ success: true, id, slug }))
        .catch(err =>
            err.message === 'instance not unique'
                ? res.json({ success: true, slug })
                : res.json({ success: false, err }),
        );
};

export default handler;
