import React, { useState } from 'react';
import { NextPage } from 'next';
import { Container, TextField, Button, Typography } from '@material-ui/core';
import useForm from 'react-hook-form';
import { useTitle } from 'react-use';
import fetch from 'isomorphic-unfetch';

interface IValues {
    url: string;
}

const Index: NextPage = () => {
    useTitle('Referral Roulette');
    const [inFlight, setInFlight] = useState(false);
    const [slug, setSlug] = useState('');
    const [message, setMessage] = useState('');
    const { register, handleSubmit, errors } = useForm<IValues>({
        mode: 'onBlur',
    });

    const onSubmit = async (values: IValues) => {
        setInFlight(true);
        const response = await fetch('/api/submitLink', {
            method: 'POST',
            body: values.url,
        }).then(r => r.json());
        setInFlight(false);

        if (response.success) {
            setSlug(response.slug);
        } else {
            setMessage(response.err.message);
        }
    };
    return (
        <Container maxWidth="sm">
            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {slug ? (
                    <Typography variant="h3">
                        https://referral-roulette.now.sh/api/r/{slug}
                    </Typography>
                ) : (
                    <React.Fragment>
                        <TextField
                            name="url"
                            type="url"
                            inputRef={register({
                                required: 'Referral Link is required',
                            })}
                            error={!!errors.url}
                            helperText={errors.url && errors.url.message}
                            fullWidth
                            variant="outlined"
                            label="Referral Link"
                        />
                        <br />
                        <Button
                            disabled={inFlight}
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {inFlight ? 'Submiting...' : 'Submit'}
                        </Button>
                        {message && (
                            <Typography variant="caption">{message}</Typography>
                        )}
                    </React.Fragment>
                )}
            </form>
        </Container>
    );
};

export default Index;
